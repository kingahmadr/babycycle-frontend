import React from "react";

const TestingPage: React.FC = () => {
  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="header-primary mb-6">Testing Page</h1>

      {/* Font Styles */}
      <section className="mb-10">
        <h2 className="header-md text-textGray mb-4">Font Styles</h2>
        <p className="text-heading-xl text-textGray mb-2">Heading XL</p>
        <p className="text-heading-md text-textGray mb-2">Heading MD</p>
        <p className="text-body-lg text-textGray mb-2">Body LG - Section Heading</p>
        <p className="text-body-md text-textGray mb-2">Body MD - Product Details</p>
        <p className="text-body-sm text-textGray mb-2">Body SM - Small text for reviews</p>
        <p className="text-label-md text-textGray mb-2">Label MD - Buttons and Inputs</p>
        <p className="text-label-sm text-textGray mb-2">Label SM - Small uppercase labels</p>
      </section>

      {/* Buttons */}
      <section className="mb-10">
        <h2 className="header-md mb-4">Buttons</h2>
        <div className="space-y-4">
          <button className="btn-primary">Primary Button</button>
          <button className="btn-secondary">Secondary Button</button>
          <button className="btn-danger">Danger Button</button>
          <button className="btn-neutral">Neutral Button</button>
          <button className="btn-disabled" disabled>
            Disabled Button
          </button>
          <button className="btn-icon">
            <span>Icon Button</span>
            <span>🔍</span>
          </button>
        </div>
      </section>

      {/* Input Fields */}
      <section className="mb-10">
        <h2 className="header-md mb-4">Input Fields</h2>
        <div className="space-y-4">
          <input
            className="input"
            type="text"
            placeholder="Default Input Field"
          />
          <input
            className="input-sm"
            type="text"
            placeholder="Small Input Field"
          />
          <textarea
            className="textarea"
            placeholder="Textarea Field"
            rows={3}
          ></textarea>
        </div>
      </section>

      {/* Cards */}
      <section>
        <h2 className="header-md mb-4">Cards</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="card-product">
            <h3 className="text-heading-md">Product Card</h3>
            <p className="text-body-sm">A description of the product.</p>
          </div>
          <div className="card-review">
            <h3 className="text-heading-md">Review Card</h3>
            <p className="text-body-sm">This is a review for a product.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestingPage;
