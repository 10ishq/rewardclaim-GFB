import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClaimReward from './components/ClaimReward';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path='/' element={<></>}/> */}
        <Route path="/:productHash/" element={<ClaimReward/>} />
        {/* <Route path="/redeem/" component={<ClaimReward/>} /> */}
      </Routes>
    </Router>
  );
};

export default App;
