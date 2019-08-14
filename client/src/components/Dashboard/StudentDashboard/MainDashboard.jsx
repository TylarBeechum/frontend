import React, { useEffect } from 'react';
import { useStateValue } from 'react-conflux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { InfiniteScroll, Box } from 'grommet';
import FuzzySearch from 'fuzzy-search';

import { BaseButton } from '../../../styles/themes';
import searchIcon from '../../../images/search-icon.svg';

import CredCard from '../Card/CredCard';
import DashboardLoading from '../DashboardLoading';

import queries from './queries';
import {
  schoolContext,
  SCHOOL_DATA_START,
  SCHOOL_DATA_SUCCESS,
  SCHOOL_DATA_ERROR,
  SEARCH_HANDLE_CHANGE
} from '../../../store/reducers/schoolReducer';
import { globalContext } from '../../../store/reducers/globalReducer';

const MainDashboard = ({ history }) => {
  const [{ user }] = useStateValue(globalContext);
  const [schoolState, schoolDispatch] = useStateValue(schoolContext);
  useEffect(() => {
    if (!schoolState.schoolData) {
      schoolDispatch({ type: SCHOOL_DATA_START });
      async function getUserData() {
        try {
          const { id } = user;
          const data = await queries.getUserById({
            id
          });
          schoolDispatch({ type: SCHOOL_DATA_SUCCESS, payload: data });
        } catch (err) {
          schoolDispatch({ type: SCHOOL_DATA_ERROR });
        }
      }
      getUserData();
    }
  }, [schoolDispatch]); // Re-render whenever an action in schoolContext is dispatched
  let searchResult = [];
  if (schoolState.schoolData) {
    const searchTerms = ['credName', 'criteria', 'ownerName', 'issuedOn'];
    const searchOptions = {
      caseSensitive: false
    };
    const searcher = new FuzzySearch(
      schoolState.schoolData.schoolDetails.credentials,
      searchTerms,
      searchOptions
    );
    searchResult = searcher.search(schoolState.schoolSearchInput);
  }
  const handleChange = e => {
    schoolDispatch({ type: SEARCH_HANDLE_CHANGE, payload: e.target.value });
  };
  return (
    <>
      <SchoolDetails>
        {schoolState.schoolDataSuccess ? (
          <h2>{schoolState.schoolData.schoolDetails.name}</h2>
        ) : (
          <div />
        )}
        <div>
          <input
            type="text"
            name="searchText"
            placeholder="Search"
            onChange={handleChange}
            value={schoolState.schoolSearchInput}
          />
          <IssueCredButton
            type="button"
            onClick={() => history.push('/dashboard/credForm')}
            label="+ Issue Credential"
            primary
          />
        </div>
      </SchoolDetails>
      {schoolState.schoolDataStart ? (
        <DashboardLoading />
      ) : (
        <>
          {schoolState.schoolDataSuccess && searchResult.length ? (
            <Box height="75vh" overflow="auto">
              <InfiniteScroll items={searchResult} step={10}>
                {item => {
                  return <CredCard key={item.id} cred={item} />;
                }}
              </InfiniteScroll>
            </Box>
          ) : (
            schoolState.schoolDataSuccess && (
              <NothingFound>
                {!schoolState.schoolData.schoolDetails.credentials.length
                  ? 'Issue a credential to get started...'
                  : 'No results were found..'}
              </NothingFound>
            )
          )}
        </>
      )}
    </>
  );
};

MainDashboard.propTypes = {
  history: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

const SchoolDetails = styled.section`
  margin: 50px auto 30px;
  max-width: 1600px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  div {
    display: flex;
    width: 68%;
    justify-content: flex-end;
    align-items: center;

    input {
      background: white url(${searchIcon}) no-repeat scroll 5px 5px;
      background-size: 20px;
      background-position: right 13px center;
      border: 2px solid ${({ theme }) => theme.global.colors.searchBarBorder};
      color: ${({ theme }) => theme.global.colors.searchBarColor};
      height: 40px;
      margin-right: 1.5%;
      padding: 25px 5% 25px 2.5%;
      transition: 0.25s ease-in-out;
      width: 220px;
      caret-color: grey;
      border-radius: 50px;
      font-size: 1.8rem;

      ::placeholder {
        color: ${({ theme }) => theme.global.colors.searchBarColor};
        font-weight: 700;
      }

      &:focus {
        color: ${({ theme }) => theme.global.colors.brand};
        border-color: ${({ theme }) => theme.global.colors.brand};
        outline: none;
        padding-left: 15px;
        width: 50%;
      }
    }
  }
`;

const IssueCredButton = styled(BaseButton)`
  padding: 12px 15px;
  color: white;
  text-align: right;
  border-radius: 50px;
  margin-left: 2%;
`;

const NothingFound = styled.p`
  width: 100%;
  text-align: center;
  font-size: 2.4rem;
  margin-top: 20vh;
  color: ${({ theme }) => theme.global.colors['status-disabled']};
`;

export default MainDashboard;