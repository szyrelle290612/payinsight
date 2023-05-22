import { useNavigate } from "react-router-dom";
import React, { Component } from "react";

export const withNavigation = (Component) => {
    return props => <Component {...props} navigate={useNavigate()} />;
}