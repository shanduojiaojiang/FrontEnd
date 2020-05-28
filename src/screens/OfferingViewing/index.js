/**
 * Offering Viewing Page/Home Page/Student Page of ClassTranscribe
 */

import React from 'react';
import _ from 'lodash';
import { Route, Switch } from 'react-router-dom';
import { CTLayout } from 'components';
import { api, user } from 'utils';
import './transition.css';
import './index.css';

import { 
  Home, 
  Starred, 
  History, 
  Search, 
  OfferingDetail, 
  Analytics 
} from './Components';


export class OfferingViewing extends React.Component {
  constructor(props) {
    super(props);
    this.isLoggedIn = user.isLoggedIn;

    this.state = {
      displaySideBar: !((window.innerWidth < 900) /* || user.isLoggedIn */),
      displaySearchHeader: !(window.innerWidth < 600),

      offerings: ['Unloaded'],
      watchHistory: this.isLoggedIn ? ['unloaded'] : [],
      watchHistoryJSON: {},
      starredOfferings: this.isLoggedIn ? ['unloaded'] : [],
      starredOfferingsJSON: {},

      onboarded: true,
    };
  }

  componentDidMount() {
    /**
     * 1. Setup user and then get all data based on userId
     */
    this.getOfferingsByStudent();
    this.getUserMetadata();
    /**
     * 2. listen on window size for showing or hiding sidebar
     */
    window.addEventListener('resize', () => {
      const { displaySideBar, displaySearchHeader } = this.state;
      if (window.innerWidth < 600 && displaySearchHeader)
        this.setState({ displaySearchHeader: false });
      else if (window.innerWidth >= 600 && !displaySearchHeader)
        this.setState({ displaySearchHeader: true });

      if (window.innerWidth < 900 && displaySideBar) this.setState({ displaySideBar: false });
      else if (window.innerWidth >= 900 && !displaySideBar /* && !user.isLoggedIn */)
        this.setState({ displaySideBar: true });
    });
  }

  getOfferingsByStudent = () => {
    this.setState({ offerings: ['Unloaded'] });
    api
      .getOfferingsByStudent()
      .then(({ data }) => {
        this.completeOfferings((data || []).slice().reverse());
        api.contentLoaded();
      })
      .catch((error) => {
        this.setState({ offerings: ['retry'] });
        api.contentLoaded();
      });
  };

  componentDidUpdate(prevProps, prevState) {
    const { watchHistoryJSON, watchHistory } = this.state;
    if (watchHistory !== prevState.watchHistory) {
      if (watchHistory.length && watchHistory.length > 30) {
        for (let i = 30; i < watchHistory.length; i += 1) {
          const { mediaId } = watchHistory[i];
          if (watchHistoryJSON[mediaId]) delete watchHistoryJSON[mediaId];
        }
        this.setState(
          {
            watchHistoryJSON,
            watchHistory: watchHistory.slice(0, 30),
          },
          () => this.updateUserMetadata(),
        );
      }
    }
  }

  getUserMetadata = () => {
    if (!this.isLoggedIn) return;
    api.storeUserMetadata({
      setWatchHistory: (watchHistoryJSON) => this.setState({ watchHistoryJSON }),
      setStarredOfferings: (starredOfferingsJSON) => this.setState({ starredOfferingsJSON }),
      setWatchHistoryArray: (watchHistory) => this.setState({ watchHistory }),
      setStarredOfferingsArray: (starredOfferings) => this.setState({ starredOfferings }),
      // setOnboarded: onboarded => this.setState({ onboarded: Boolean(onboarded['home']) }),
    });
  };

  updateUserMetadata = () => {
    const { watchHistoryJSON, starredOfferingsJSON } = this.state;
    api.postUserMetaData({
      watchHistory: JSON.stringify(watchHistoryJSON),
      starredOfferings: JSON.stringify(starredOfferingsJSON),
    });
    // console.log(watchHistoryJSON, starredOfferingsJSON)
  };

  completeOfferings = async (rawOfferings) => {
    const offerings = await api.parseOfferings(rawOfferings);
    this.setState({ offerings });
  };

  handleShowSidebar = (value) => {
    if (typeof value === 'boolean') this.setState({ displaySideBar: value });
    else this.setState((prevState) => ({ displaySideBar: !prevState.displaySideBar }));
  };

  removeWatchHistory = (mediaId) => {
    const { watchHistory, watchHistoryJSON } = this.state;
    _.remove(watchHistory, { mediaId });
    if (watchHistoryJSON[mediaId]) {
      delete watchHistoryJSON[mediaId];
    }
    this.setState({ watchHistory, watchHistoryJSON }, () => this.updateUserMetadata());
  };

  starOffering = (offeringId) => {
    const { starredOfferings, starredOfferingsJSON } = this.state;
    starredOfferings.push(offeringId);
    starredOfferingsJSON[offeringId] = 'starred';
    this.setState({ starredOfferings, starredOfferingsJSON }, () => this.updateUserMetadata());
  };

  unstarOffering = (offeringId) => {
    const { starredOfferings, starredOfferingsJSON } = this.state;
    _.remove(starredOfferings, (id) => id === offeringId);
    if (starredOfferingsJSON[offeringId]) delete starredOfferingsJSON[offeringId];
    this.setState({ starredOfferings, starredOfferingsJSON }, () => this.updateUserMetadata());
  };

  getLayoutProps() {
    return {
      transition: true,
      defaultOpenSidebar: true,
      headerProps: {},
      sidebarProps: {}
    }
  }

  render() {
    const { displaySideBar, displaySearchHeader, offerings } = this.state;
    // the padding style of the content when sidebar is not floating
    const paddingLeft = {
      paddingLeft:
        displaySideBar && window.innerWidth > 900 ? '22rem' : displaySearchHeader ? '2rem' : '0rem',
    };

    return (
      <Route
        render={({ location }) => (
          <CTLayout {...this.getLayoutProps()}>
            <div id="sp-content" className="sp-content">
              <Switch location={location}>
                {/* Unauthed home page */}
                <Route exact path="/home" render={(props) => <Home {...props} {...this} />} />
                {/* Starred */}
                <Route exact path="/home/starred" render={() => <Starred {...this} />} />
                {/* History */}
                <Route exact path="/home/history" render={() => <History {...this} />} />
                {/* Offering Detail page */}
                <Route
                  exact
                  path="/home/offering/:id"
                  render={() => <OfferingDetail {...this} />}
                />
                {/* Search Page */}
                <Route
                  exact
                  path="/home/search"
                  render={(props) => <Search offerings={offerings} {...props} />}
                />

                {/* Personal Report */}
                <Route
                  exact
                  path="/home/personal-report"
                  render={(props) => <Analytics {...props} {...this.state} />}
                />
              </Switch>
            </div>
          </CTLayout>
        )}
      />
    );
  }
}
