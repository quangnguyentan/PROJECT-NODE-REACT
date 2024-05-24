import authRouter from "./auth";
import userRouter from "./user";
import productRouter from "./product";
import orderRouter from "./order";

import insetRouter from "./insert";
const initRoutes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/insert", insetRouter);
  app.use("/api/order", orderRouter);
};
export default initRoutes;
