import React, { useEffect, useState } from "react";
import Filters from "../cook-listing/filters";
import { connect } from "react-redux"
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Map, InfoWindow, Marker, GoogleApiWrapper, google } from 'google-maps-react';
import InfoWindowEx from "./InfoWindowEx";
import { useTranslation } from "react-i18next";
const { REACT_APP_API_URL } = process.env;
function MapView(props) {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const { cooks } = props
  const location = useLocation();
  const [activeMarker, setActiveMarker] = useState(null)
  const [clickedCook, setClickedCook] = useState({})
  const [showingInfoWindow, setShowingInfoWindow] = useState(false)
  const [currentCenter, setCurrentCenter] = useState({})
  const path = location.pathname

  const onMarkerClick = (props, marker) => {
    setActiveMarker(marker)
    setShowingInfoWindow(true)
    setClickedCook(props.data)
  }

  const onInfoWindowClose = () => {
    setActiveMarker(null)
    setShowingInfoWindow(false)
  }

  const showDetails = place => {
    navigate(`/cookreact/cook-details/${clickedCook._id}`)
  };

  // useEffect(() => {
  //   if (cooks != null && cooks.length > 0) {
  //     cooks.map(cook => {
  //       if ((cook?.lng && cook?.lng != '')
  //         && (cook?.lat && cook?.lat != '')
  //         && (cook?.lng > -180 && cook?.lng < 180)
  //         && (cook?.lat > -90 && cook?.lat < 90)) {
  //         setCurrentCenter({ lat: Number(cook?.lat), lng: Number(cook?.lng) })
  //         return
  //       }
  //     })
  //   }
  // }, [cooks])
  const { query } = props
  useEffect(() => {
    if (query?.lat && query?.lng && query.lat != '' && query.lat != null && query.lng != '' && query.lng != null) {
      setCurrentCenter({ lat: Number(query?.lat), lng: Number(query?.lng) })
    } else if (cooks != null && cooks.length > 0) {
      cooks.map(cook => {
        if ((cook?.lng && cook?.lng != '')
          && (cook?.lat && cook?.lat != '')
          && (cook?.lng > -180 && cook?.lng < 180)
          && (cook?.lat > -90 && cook?.lat < 90)) {
          setCurrentCenter({ lat: Number(cook?.lat), lng: Number(cook?.lng) })
          return
        }
      })
    }
  }, [query])
  return (
    <div>
      <div className="ratio ratio-4x3 mt-3 mt-md-0 mb-5 mb-md-0">
        <Map google={props.google}
          defaultCenter={currentCenter}
          center={currentCenter}
          zoom={12}>

          {cooks != null && cooks.length > 0 &&
            cooks.map((_oneCook, index) =>
              <Marker key={index}
                onClick={onMarkerClick}
                data={_oneCook}
                title={_oneCook?.firstname + ' ' + _oneCook?.lastname}
                name={_oneCook?.firstname + ' ' + _oneCook?.lastname}
                position={{ lat: _oneCook?.lat, lng: _oneCook?.lng }}
                // label="qwertyuiop"
                // animation={props.google.maps.Animation.DROP}
                icon={{
                  url: (_oneCook?.pictures && _oneCook?.pictures !== null
                    && _oneCook?.pictures !== '') ? `${REACT_APP_API_URL}${_oneCook?.pictures}#custom_images_style`
                    : `${window.location.origin}/cookreact/user.png#custom_images_style`,
                  anchor: new props.google.maps.Point(32, 32),
                  scaledSize: new props.google.maps.Size(50, 50),
                  origin: new props.google.maps.Point(0, 0),
                  anchor: new props.google.maps.Point(0, 32),
                }} />
            )}
          <InfoWindowEx marker={activeMarker} visible={showingInfoWindow}>
            <div>
              <h6>{clickedCook?.firstname + ' ' + clickedCook?.lastname}</h6>
              <span className="d-flex mb-2">{clickedCook?.city}</span>
              <button className="btn btn-success fs-6 button-shadow" type="button" onClick={showDetails}>
                {t("dashboard.view_profile")}
              </button>
            </div>
          </InfoWindowEx>

        </Map>
      </div>
      {/* } */}
    </div>
  );
}
const mapStateToProps = state => {
  return {
    cooks: state.cooks.cooks,
    filters: state.filters.filters
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyARGpUdzBWKnyufzqzh6sS2jlB91Grx9Ys'
})(connect(mapStateToProps)(MapView));
