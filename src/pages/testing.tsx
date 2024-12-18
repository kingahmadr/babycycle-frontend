import React from "react";

const TestingPage: React.FC = () => {
  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="header-primary mb-6">Testing Page</h1>

      {/* Font Styles */}
      <section className="mb-10">
        <h2 className="header-md mb-4">Font Styles</h2>
        <p className="text-heading-xl mb-2">Heading XL</p>
        <p className="text-heading-md mb-2">Heading MD</p>
        <p className="text-body-lg mb-2">Body LG - Section Heading</p>
        <p className="text-body-md mb-2">Body MD - Product Details</p>
        <p className="text-body-sm mb-2">Body SM - Small text for reviews</p>
        <p className="text-label-md mb-2">Label MD - Buttons and Inputs</p>
        <p className="text-label-sm mb-2">Label SM - Small uppercase labels</p>
      </section>

      {/* Buttons */}
      <section className="mb-10">
        <h2 className="header-md mb-4">Buttons</h2>
        <div className="space-y-4">
          <button className="btn-primary">Primary Button</button>
          <button className="btn-secondary">Secondary Button</button>
          <button className="btn-danger">Danger Button</button>
          <button className="btn-disabled" disabled>
            Disabled Button
          </button>

        </div>
      </section>

{/* Labels */}
<section className="mb-10">
        <h2 className="header-md mb-4">Labels</h2>
        <div className="flex items-center space-x-4">
          {/* Warranty Label */}
          <div className="warranty-label">WARRANTY</div>
        </div>
      </section>

{/* Add to Cart & Buy Button */}
<section className="mb-10">
        <h2 className="header-md mb-4">Add to Cart & Buy Now </h2>
        <div className="flex flex-col items-center gap-4">
        {/* Add to Cart Button */}
        <button className="btn-add-to-cart">ADD TO CART</button>

        {/* Buy Now Button */}
        <button className="btn-buy-now">BUY NOW</button>
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

          <textarea
            className="text-area"
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
