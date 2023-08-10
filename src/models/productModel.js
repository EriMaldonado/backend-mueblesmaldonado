import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number },
    priceCocina: { type: Number },
    priceCloset: { type: Number },
    priceDeskBasic: { type: Number },
    priceDeskStandard: { type: Number },
    priceMesaBasic: { type: Number },
    priceMesaStandard: { type: Number },
    pricelibreroBasic: { type: Number },
    pricelibreroStandard: { type: Number },
    priceVeladorBasic: { type: Number },
    priceVeladorStandard: { type: Number },
    priceComodaBasic: { type: Number },
    priceComodaStandard: { type: Number },
    pricetvBasic: { type: Number },
    pricetvStandard: { type: Number },
    pricePanelBasic: { type: Number },
    pricePanelStandard: { type: Number },
    priceTwin: { type: Number },
    priceDouble: { type: Number },
    priceQueen: { type: Number },
    priceKing: { type: Number },
    images: [
      {
        public_id: { type: String },
        secure_url: { type: String },
      },
    ],
    type: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
