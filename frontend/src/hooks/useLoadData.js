import React from "react";
const useLoadData = () => {
  // Simulate data loading with a timeout
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate a 1 second loading time

    return () => clearTimeout(timer);
  }, []);

  return isLoading;
};

export default useLoadData;