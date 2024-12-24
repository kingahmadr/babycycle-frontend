const PageNotFound = () => {
  return (
    <div className="w-full h-auto flex flex-col justify-center items-center p-14">
      <div>
        <img
          src="https://i.pinimg.com/736x/c5/2c/30/c52c304cca37753c630e8f206cbfcef3.jpg"
          alt="not found"
        />
        <div className="w-full flex flex-col items-center text-center font-body text-secondary">
          <p className="font-bold text-3xl">404</p>
          <p>We couldn&apos;t find this page, but we found this capybara for you!</p>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
