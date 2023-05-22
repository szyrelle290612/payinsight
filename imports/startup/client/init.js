import React from 'react';
import { createRoot } from 'react-dom/client';
import { Meteor } from 'meteor/meteor';
import { BrowserRouter } from "react-router-dom"
import Routes from "./routes"

Meteor.startup(() => {
  Meteor.absoluteUrl.defaultOptions.rootUrl = 'https://83c2-180-190-250-69.ngrok-free.app';
  const container = document.getElementById('react-target');
  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <Routes />
    </BrowserRouter>,
  );
});
