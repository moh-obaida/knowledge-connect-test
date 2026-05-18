import { Toaster } from "@/components/ui/sonner";
import { Route, Switch } from "wouter";
import HostView from "./pages/HostView";
import JoinPage from "./pages/JoinPage";
import ParticipantView from "./pages/ParticipantView";
import Home from "./pages/Home";
import DisplayMode from "./pages/DisplayMode";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/host" component={HostView} />
        <Route path="/join" component={JoinPage} />
        <Route path="/participant" component={ParticipantView} />
        <Route path="/display" component={DisplayMode} />
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </>
  );
}

export default App;
