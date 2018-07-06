
const Router = ReactRouterDOM.BrowserRouter, Route = ReactRouterDOM.Route, Link = ReactRouterDOM.Link, Switch = ReactRouterDOM.Switch;
const rootPath = location.pathname;

const Bardly = () => (
  <Router>
    <Switch>
      <Route path={rootPath} exact component={ScenarioTerminal} />
      <Route path={rootPath + 'scene/:sceneId/track'} component={TrackPicker} />
    </Switch>
  </Router>
);

ReactDOM.render(
  <Bardly />,
  document.getElementById('root')
);