
const Router = ReactRouterDOM.BrowserRouter, Route = ReactRouterDOM.Route, Link = ReactRouterDOM.Link, Switch = ReactRouterDOM.Switch;

const Bardly = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={ScenarioTerminal} />
      <Route path="/scene/:sceneId/track" component={TrackPicker} />
    </Switch>
  </Router>
);

ReactDOM.render(
  <Bardly />,
  document.getElementById('root')
);