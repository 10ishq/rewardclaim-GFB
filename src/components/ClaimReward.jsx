import "../flow/config.js";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { useParams } from 'react-router-dom';
import Confetti from "react-confetti";

function ClaimReward() {
  const { productHash } = useParams();
  console.log(productHash)

  const [user, setUser] = useState({ loggedIn: null });
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [rewardStatus, setRewardStatus] = useState(null);
  const [consoleStatus, setConsoleStatus] = useState(null);

  useEffect(() => {
    fcl.currentUser.subscribe(setUser);
  }, []);

  const redeemReward = async () => {
    setLoading(true);
    setRewardStatus(null);

    try {
      const response = await fetch(`https://greenflowchain-user.onrender.com/redeemReward?productHash=${productHash}&flowAddress=${user.addr}`);
      const data = await response.json();
      // in setConsoleStatus set stringified response
      setConsoleStatus(JSON.stringify(data));
      console.log(data);
      if (response.status !== 200) {
        setConsoleStatus("failure");
        setRewardStatus("failure");
      } else {
        setRewardStatus(data.status);
      }
    } catch (error) {

      setConsoleStatus(JSON.stringify(error) + "Caught error");
      console.log(error);
    }

    setLoading(false);
  };

  const AuthedState = () => {
    if (loading) {
      return <ClaimingReward />;
    }

    if (rewardStatus === "success") {
      return <RewardSuccess />;
    }

    if (rewardStatus === "failure")  {
      console.log(rewardStatus)
      return <RewardFailure />;
    }

    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-white mb-4">
          <div>Your Address: {user?.addr ?? "No Address"}</div>
          {/* <div>Console Status: {consoleStatus ?? ""}</div> */}
          {/* <div>Profile Name: {name ?? "--"}</div> */}
        </div>
        <button
          className="py-8 px-16 rounded bg-blue-500 hover:bg-blue-600 text-white text-4xl font-bold"
          onClick={redeemReward}
        >
          Claim Reward!
        </button>

      </div>
    );
  };

  const UnauthenticatedState = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <button
          className="py-8 px-16 rounded bg-blue-500 hover:bg-blue-600 text-white text-4xl font-bold"
          onClick={fcl.logIn}
        >
          Connect Wallet to Claim Reward!
        </button>
      </div>
    );
  };

  const ClaimingReward = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-white text-6xl">Claiming Reward...</h2>
      </div>
    );
  };

  const RewardSuccess = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-white text-6xl mb-4">Congratulations! You've successfully claimed the reward!</h2>
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      </div>
    );
  };

  const RewardFailure = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-white text-6xl mb-4">Oops! Claiming the reward failed. Please try again later.</h2>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto py-8">
        {user.loggedIn ? <AuthedState /> : <UnauthenticatedState />}
      </div>
    </div>
  );
}

export default ClaimReward;
