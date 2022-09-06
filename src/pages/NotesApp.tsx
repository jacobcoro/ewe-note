import RouteGuard from 'components/base/RouteGuard';
import NotesApp from '../components/notes/NotesApp';

const App = () => {
  return (
    <RouteGuard>
      <NotesApp />
    </RouteGuard>
  );
};

export default App;
