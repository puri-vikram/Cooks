import React, { useEffect, useState, Component } from "react";
import ReactDOM from 'react-dom'
import Filters from "../cook-listing/filters";
import { connect } from "react-redux"
import { Link } from 'react-router-dom';
import { Map, InfoWindow, Marker, GoogleApiWrapper, google } from 'google-maps-react';
export default class InfoWindowEx extends Component {
  constructor(props) {
    super(props);
    this.infoWindowRef = React.createRef();
    this.contentElement = document.createElement(`div`);
  }

  componentDidUpdate(prevProps) {
    if (this.props.children !== prevProps.children) {
      ReactDOM.render(
        React.Children.only(this.props.children),
        this.contentElement
      );
      this.infoWindowRef.current.infowindow.setContent(this.contentElement);
    }
  }

  render() {
    return <InfoWindow ref={this.infoWindowRef} {...this.props} />;
  }
}