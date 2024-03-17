import './App.css';
import Sidebar from './components/navBar/navBar';
import Member from './components/member/Member';

import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import Banner from './components/banner/banner';

function App() {
  return (
    <div className="App">
      <Banner />
      <div className="content">
        <Sidebar />
        <PrimeReactProvider>
          <Member />
        </PrimeReactProvider>
      </div>
    </div>
  );
}

export default App;
