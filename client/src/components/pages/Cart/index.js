import React, { useEffect, useState } from "react";
import { Button } from "../../atoms";
import { Link, Navigate, useNavigate } from "react-router-dom";
import path from "../../../utils/path";
import icons from "../../../utils/icons";
import { useDispatch, useSelector } from "react-redux";
import { getCurrent } from "../../../stores/actions/userAction";
import {
  apiGetProduct,
  apiGetProductById,
} from "../../../services/productService";
import { emtyCart } from "../../atoms/images";
import { formatMoney, renderStartFromNumber } from "../../../utils/helper";
import { apiRemoveCart, apiUpdateCart } from "../../../services/userService";
import { useForm } from "react-hook-form";
import { encrypt, decrypt, compare } from "n-krypta";
import { Base64 } from "js-base64";
const { CiStar, RiDeleteBin6Line, CiDeliveryTruck, GoPlus, FiMinus } = icons;
const Cart = () => {
  const dispatch = useDispatch();
  const day = new Date();
  const secret = "my-secret";

  const { currentData } = useSelector((state) => state.user);
  const [products, setProducts] = useState(null);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [selectedItem, setSelectedItem] = useState([]);
  const getApiProduct = async () => {
    const response = await apiGetProduct({
      limit: 5,
      page: 3,
    });
    if (response?.success) setProducts(response?.products);
  };
  const navigate = useNavigate();

  const handleRemoveProduct = async (id) => {
    const response = await apiRemoveCart(id);
    if (response?.success) {
      dispatch(getCurrent());

      const value = JSON.parse(localStorage.getItem("selectedId"));

      if (value) {
        for (let i = 0; i < localStorage.length; i++) {
          const getIds = value?.filter((item) => id !== item);
          localStorage.setItem("selectedId", JSON.stringify(getIds));
          console.log(getIds.length === 0);
          if (getIds.length === 0) {
            localStorage.removeItem("selectedId");
            localStorage.removeItem("allCheckbox");
          }
        }
      }

      localStorage.removeItem(id.slice(-4));
      localStorage.removeItem(id);
    }
  };
  useEffect(() => {
    getApiProduct();
  }, []);
  const getLocal = (id) => localStorage.getItem(id);

  const handleChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedItem([...selectedItem, value]);
      currentData?.cart?.map((el) => {
        if (el?.product?._id === value) {
          el.isChecked = true;
          localStorage.setItem(value.slice(-4), JSON.stringify(isChecked));
        }
      });
    } else {
      currentData?.cart?.map((el) => {
        if (el?.product?._id === value) {
        }
      });
      setSelectedItem((prev) => {
        return prev.filter((id) => {
          return id !== value;
        });
      });
      localStorage.removeItem(value.slice(-4));
      localStorage.removeItem("selectedId");
    }
  };

  const checkAllHanler = (e) => {
    const isChecked = e.target.checked;
    console.log(isChecked);
    if (isChecked) {
      const postIds = currentData?.cart?.map((item) => {
        item.isChecked = true;
        localStorage.setItem(
          item?.product?._id.slice(-4),
          JSON.stringify(isChecked)
        );
        // item.isChecked = isChecked;
        // for (let i = 0; i < localStorage.length; i++) {
        //   const key = localStorage.key(i);
        //   const value = JSON.parse(localStorage.getItem(key));
        //   currentData?.cart?.map((el) => {
        //     if (el?.product?._id.slice(-4) === key.slice(-4))
        //       el.isChecked = value;
        //   });
        // }

        return item?.product?._id;
      });
      setSelectedItem(postIds);
      localStorage.setItem("selectedId", JSON.stringify(postIds));
    } else {
      // currentData?.cart?.map((item) => {
      //   item.isChecked = false;
      // });
      // console.log(currentData?.cart);
      currentData?.cart?.map((item) => {
        localStorage.removeItem(item?.product?._id.slice(-4));
      });
      localStorage.removeItem("selectedId");
      setSelectedItem([]);
    }
  };

  const handleSetLocal = () => {
    const selected = [];
    currentData?.cart?.map((el) => {
      if (currentData?.cart?.length > 0 && el?.isChecked) {
        selected.push(el);
      }
      localStorage.setItem("cart", JSON.stringify(selected));
      // const encodedData = Base64.encode(
      //   localStorage.setItem("cart", JSON.stringify(selected))
      // );

      // console.log(encodedData);
    });
  };
  const isValue = currentData?.cart?.map((item) => {
    return item;
  });

  function getKeysFromLocalStorage() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        currentData?.cart?.map((item) => {
          if (item?.product?._id?.slice(-4) === key) {
            keys.push(key);
          }
        });
      }
    }

    return keys.slice(-4);
  }
  const getKeys = getKeysFromLocalStorage();
  // getKeys.map((el) => {
  //   currentData?.cart?.filter((item) => {
  //     if (el === item?.product?._id?.slice(-4)) {
  //       item.isChecked = true;
  //     }
  //   });
  // });
  // const findIsCheckedFromCurrent = currentData?.cart?.filter((item) => {
  //   return item.isChecked;
  // });

  // useEffect(() => {

  // }, [findIsCheckedFromCurrent]);

  if (getKeys.length === currentData?.cart?.length) {
    isValue?.map((item) => {
      item.isChecked = true;
    });
  } else {
    currentData?.cart?.map((item) => {
      if (getKeysFromLocalStorage().includes(item?.product?._id.slice(-4))) {
        item.isChecked = true;
      } else {
        item.isChecked = false;
      }
    });
  }
  const findIsChecked = currentData?.cart?.filter(
    (item) => item.isChecked === true
  );
  const postIds = findIsChecked?.map((item) => {
    return item?.product?._id;
  });
  if (
    isValue?.length > 0 &&
    findIsChecked?.length === currentData?.cart?.length
  ) {
    localStorage.setItem("allCheckbox", JSON.stringify(true));
    localStorage.setItem("selectedId", JSON.stringify(postIds));
  } else {
    localStorage.removeItem("allCheckbox");
    localStorage.removeItem("selectedId");
  }

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("selectedId"))?.length ===
      currentData?.cart?.length
    ) {
      setIsAllChecked(true);
      localStorage.setItem("allCheckbox", JSON.stringify(true));
    } else if (
      JSON.parse(localStorage.getItem("selectedId"))?.length !==
      currentData?.cart?.length
    ) {
      setIsAllChecked(false);
      localStorage.removeItem("allCheckbox");
      localStorage.removeItem("selectedId");
    }
  }, [JSON.parse(localStorage.getItem("selectedId")), currentData]);

  const handleQuantity = async (id, type) => {
    let local = getLocal(id);
    const findProduct = currentData?.cart?.filter(
      (el) => el.product?._id === id
    );
    if (type === "increase" && findProduct) {
      const updatedQuantity = Number(local) + 1;
      localStorage.setItem(id, JSON.stringify(updatedQuantity));
      // findProduct[0].quantity = updatedQuantity;
      const response = await apiUpdateCart({
        pid: id,
        type,
        color: findProduct[0].color,
      });
      if (response?.success) {
        setTimeout(() => {
          dispatch(getCurrent());
        }, 100);
      }
    } else {
      if (type === "reduce" && findProduct) {
        if (Number(local) <= 1) {
          const response = await apiRemoveCart(id);
          if (response?.success) {
            dispatch(getCurrent());
            localStorage.removeItem(id.slice(-4));
            localStorage.removeItem(id);

            const value = JSON.parse(localStorage.getItem("selectedId"));
            if (value) {
              for (let i = 0; i < localStorage.length; i++) {
                const getIds = value?.filter((item) => id !== item);
                console.log(getIds);
                localStorage.setItem("selectedId", JSON.stringify(getIds));
                if (getIds.length === 0) {
                  localStorage.removeItem("selectedId");
                  localStorage.removeItem("allCheckbox");
                }
              }
            }
          }
        } else {
          const updatedQuantity = Number(local) - 1;
          localStorage.setItem(id, JSON.stringify(updatedQuantity));
          console.log(updatedQuantity);
          const response = await apiUpdateCart({
            pid: id,
            type,
            color: findProduct[0].color,
          });
          if (response?.success) {
            dispatch(getCurrent());
          }
        }
      }
    }
  };
  return (
    <div className="w-main flex flex-col  ">
      <div className="w-full flex">
        {currentData?.cart?.length > 0 ? (
          <div className="ml-4 w-[70%] flex flex-col">
            <div className="flex flex-col w-full">
              <h3 className="text-xl font-medium p-4 pb-0 ">GIỎ HÀNG</h3>
              {currentData?.cart?.length === 0 ? (
                <div className="w-full flex-col">
                  <div className="flex items-center justify-center">
                    <img
                      src={emtyCart}
                      alt=""
                      className="flex w-[160px] h-[160px] items-center justify-center"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <h1 className="font-semibold text-lg">Giỏ hàng trống</h1>
                    <p>
                      Bạn tham khảo thêm các sản phẩm được Tiki gợi ý bên dưới
                      nhé!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="m-4 flex ">
                    <div className="bg-white w-full p-4 rounded-xl">
                      <div className="flex justify-between items-center ">
                        <div className="flex gap-2 w-[324px] ">
                          <input
                            type="checkbox"
                            name="all-checkbox"
                            onChange={checkAllHanler}
                            checked={Boolean(
                              JSON.parse(localStorage.getItem("allCheckbox"))
                            )}
                          />
                          <span>Tất cả </span>
                          <span>({currentData?.cart?.length} sản phẩm)</span>
                        </div>
                        <span>Đơn giá</span>
                        <span>Số lượng</span>
                        <span>Thành tiền</span>
                        <span>
                          <RiDeleteBin6Line />
                        </span>
                      </div>
                    </div>
                  </div>
                  {currentData?.cart &&
                    currentData?.cart?.map((el) => (
                      <div className="mx-4   flex " key={el._id}>
                        <div className="bg-white w-full p-4 rounded-xl">
                          <div className="flex justify-between items-center ">
                            <div className=" w-[324px] gap-2 flex ">
                              <input
                                type="checkbox"
                                value={el?.product?._id}
                                checked={Boolean(
                                  localStorage.getItem(
                                    el?.product?._id.slice(-4)
                                  )
                                )}
                                onChange={handleChange}
                              />

                              <div className="w-[80px] h-[80px]">
                                <Link>
                                  <img
                                    src={
                                      el?.product?.thumb?.[0]
                                        ?.split(",")[0]
                                        .split(" ")[0]
                                    }
                                    alt=""
                                  />
                                </Link>
                              </div>
                              <div className="flex flex-col gap-1 w-[202px]">
                                <span className="overflow-ellipsis overflow-hidden text-sm font-normal">
                                  {el?.product?.title}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {el?.color === "Không có" ? "" : el?.color}
                                </span>
                                <div className="flex gap-2 text-xs  font-normal">
                                  <span className="w-[32px] h-[16px]">
                                    {/* <CiDeliveryTruck className="w-full" /> */}
                                    <img
                                      src="https://salt.tikicdn.com/cache/w96/ts/tka/65/be/89/d0c3208134f19e4bab8b50d81b41933a.png"
                                      alt=""
                                    />
                                  </span>

                                  <span>
                                    Giao thứ {day.getDay() + 3},{" "}
                                    {day.getDate() + 2}/ {day.getMonth() + 1}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex">
                              {formatMoney(el?.product?.prices)}
                              <sub>₫</sub>
                            </div>
                            <div>
                              <div className="flex">
                                <div className="w-[23px] h-[24px] rounded-l-sm border pl-[2px] ">
                                  <button
                                    className=""
                                    onClick={() =>
                                      handleQuantity(el?.product?._id, "reduce")
                                    }
                                  >
                                    <FiMinus />
                                  </button>
                                </div>
                                <div className="w-[32px] h-[24px]  border">
                                  <span id="product" className=" p-3">
                                    {getLocal(el?.product?._id)}
                                  </span>
                                </div>
                                <div className="w-[23px] h-[24px] rounded-r-sm border pl-[2px] ">
                                  <button
                                    className=""
                                    onClick={() =>
                                      handleQuantity(
                                        el?.product?._id,
                                        "increase"
                                      )
                                    }
                                  >
                                    <GoPlus />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="flex">
                              {formatMoney(
                                el?.product?.prices * getLocal(el?.product?._id)
                              )}
                              <sub>₫</sub>
                            </div>
                            <span
                              onClick={() =>
                                handleRemoveProduct(el?.product?._id)
                              }
                            >
                              <RiDeleteBin6Line />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
            <div className="w-[96%] m-4 bg-white rounded-lg">
              <div className="m-4 flex ">
                <div className="bg-white w-full p-4 rounded-xl flex flex-col gap-4 ">
                  <h3 className="font-medium">Sản phẩm mua kèm</h3>
                  <div className="flex gap-2">
                    {products?.map((el) => (
                      <div key={el?._id} className="flex gap-2">
                        <Link to={`/${el?.type}/${el?._id}/${el?.slug}`}>
                          <div className="w-[142px]  hover:rounded-lg h-[240px] hover:bg-gray-100 cursor-pointer flex flex-col gap-2">
                            <img
                              className="rounded-t-lg w-full h-[148px]"
                              src={el?.thumb?.[0]?.split(",")[0].split(" ")[0]}
                              alt=""
                            />
                            <div className="px-2 flex flex-col w-full h-[80px]">
                              <p className="text-xs font-light h-[36px] text-gray-800 overflow-hidden break-words whitespace-break-spaces ">
                                {el?.title}
                              </p>
                              <span className="flex gap-1">
                                {renderStartFromNumber(Number(5))}
                              </span>
                              <div className="flex">
                                <div className="font-medium">
                                  {formatMoney(el?.prices)}
                                </div>
                                <sup className="top-[0.5em]">đ</sup>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="ml-4 w-full flex flex-col">
            <div className="flex flex-col w-full">
              <h3 className="text-xl font-medium p-4 pb-0 ">GIỎ HÀNG</h3>
              {currentData?.cart?.length === 0 ? (
                <div className="w-[96%] mx-4 bg-white flex-col">
                  <div className="p-4">
                    <div className="flex  items-center justify-center">
                      <img
                        src={emtyCart}
                        alt=""
                        className="flex w-[160px] h-[160px] items-center justify-center"
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="font-semibold text-lg">Giỏ hàng trống</h1>
                      <p>
                        Bạn tham khảo thêm các sản phẩm được Tiki gợi ý bên dưới
                        nhé!
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="m-4 flex ">
                    <div className="bg-white w-full p-4 rounded-xl">
                      <div className="flex justify-between items-center ">
                        <div className="flex gap-2 w-[324px] ">
                          <input
                            type="checkbox"
                            name="all-checkbox"
                            onChange={checkAllHanler}
                            checked={Boolean(
                              JSON.parse(localStorage.getItem("allCheckbox"))
                            )}
                          />
                          <span>Tất cả </span>
                          <span>({currentData?.cart?.length} sản phẩm)</span>
                        </div>
                        <span>Đơn giá</span>
                        <span>Số lượng</span>
                        <span>Thành tiền</span>
                        <span>
                          <RiDeleteBin6Line />
                        </span>
                      </div>
                    </div>
                  </div>
                  {currentData?.cart &&
                    currentData?.cart?.map((el) => (
                      <div className="mx-4   flex " key={el._id}>
                        <div className="bg-white w-full p-4 rounded-xl">
                          <div className="flex justify-between items-center ">
                            <div className=" w-[324px] gap-2 flex ">
                              <input
                                type="checkbox"
                                value={el?.product?._id}
                                checked={Boolean(
                                  localStorage.getItem(
                                    el?.product?._id.slice(-4)
                                  )
                                )}
                                onChange={handleChange}
                              />

                              <div className="w-[80px] h-[80px]">
                                <Link>
                                  <img
                                    src={
                                      el?.product?.thumb?.[0]
                                        ?.split(",")[0]
                                        .split(" ")[0]
                                    }
                                    alt=""
                                  />
                                </Link>
                              </div>
                              <div className="flex flex-col gap-1 w-[202px]">
                                <span className="overflow-ellipsis overflow-hidden text-sm font-normal">
                                  {el?.product?.title}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {el?.color === "Không có" ? "" : el?.color}
                                </span>
                                <div className="flex gap-2 text-xs  font-normal">
                                  <span className="w-[32px] h-[16px]">
                                    {/* <CiDeliveryTruck className="w-full" /> */}
                                    <img
                                      src="https://salt.tikicdn.com/cache/w96/ts/tka/65/be/89/d0c3208134f19e4bab8b50d81b41933a.png"
                                      alt=""
                                    />
                                  </span>

                                  <span>
                                    Giao thứ {day.getDay() + 3},{" "}
                                    {day.getDate() + 2}/ {day.getMonth() + 1}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex">
                              {formatMoney(el?.product?.prices)}
                              <sub>₫</sub>
                            </div>
                            <div>
                              <div className="flex">
                                <div className="w-[23px] h-[24px] rounded-l-sm border pl-[2px] ">
                                  <button
                                    className=""
                                    onClick={() =>
                                      handleQuantity(el?.product?._id, "reduce")
                                    }
                                  >
                                    <FiMinus />
                                  </button>
                                </div>
                                <div className="w-[32px] h-[24px]  border">
                                  <span id="product" className=" p-3">
                                    {getLocal(el?.product?._id)}
                                  </span>
                                </div>
                                <div className="w-[23px] h-[24px] rounded-r-sm border pl-[2px] ">
                                  <button
                                    className=""
                                    onClick={() =>
                                      handleQuantity(
                                        el?.product?._id,
                                        "increase"
                                      )
                                    }
                                  >
                                    <GoPlus />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="flex">
                              {formatMoney(
                                el?.product?.prices * getLocal(el?.product?._id)
                              )}
                              <sub>₫</sub>
                            </div>
                            <span
                              onClick={() =>
                                handleRemoveProduct(el?.product?._id)
                              }
                            >
                              <RiDeleteBin6Line />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
            <div className="w-[96%] m-4 bg-white rounded-lg">
              <div className="m-4 flex ">
                <div className="bg-white w-full p-4 rounded-xl flex flex-col gap-4 ">
                  <h3 className="font-medium">Sản phẩm mua kèm</h3>
                  <div className="flex gap-2">
                    {products?.map((el) => (
                      <div key={el?._id} className="flex gap-2">
                        <Link to={`/${el?.type}/${el?._id}/${el?.slug}`}>
                          <div className="w-[142px]  hover:rounded-lg h-[240px] hover:bg-gray-100 cursor-pointer flex flex-col gap-2">
                            <img
                              className="rounded-t-lg w-full h-[148px]"
                              src={el?.thumb?.[0]?.split(",")[0].split(" ")[0]}
                              alt=""
                            />
                            <div className="px-2 flex flex-col w-full h-[80px]">
                              <p className="text-xs font-light h-[36px] text-gray-800 overflow-hidden break-words whitespace-break-spaces ">
                                {el?.title}
                              </p>
                              <span className="flex gap-1">
                                {renderStartFromNumber(Number(5))}
                              </span>
                              <div className="flex">
                                <div className="font-medium">
                                  {formatMoney(el?.prices)}
                                </div>
                                <sup className="top-[0.5em]">đ</sup>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentData?.cart.length > 0 ? (
          <div className="w-[28%] flex pt-12 flex-col m-4 ml-0 gap-2">
            <div className=" bg-white  rounded-xl p-4 flex-col flex gap-4">
              <span className="font-normal text-gray-400 text-lg overflow-ellipsis overflow-hidden  ">
                <span>Giao tới</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-normal overflow-ellipsis overflow-hidden text-sm ">
                  <span>{currentData?.fullname}</span>
                </span>
                <span className="font-normal overflow-ellipsis overflow-hidden text-sm ">
                  <span>{currentData?.email}</span>
                </span>
              </div>
              <span className="font-normal overflow-ellipsis overflow-hidden text-sm ">
                <span>{currentData?.address}</span>
              </span>
            </div>
            <div className=" bg-white  rounded-xl p-4 flex-col flex gap-4">
              {currentData?.cart?.map((els) => (
                <div key={els?._id} className="flex items-center gap-2">
                  <img
                    className="w-[40px] h-[40px]"
                    src={els?.product?.thumb?.[0]?.split(",")[0].split(" ")[0]}
                    alt=""
                  />
                  <span className="font-normal text-base overflow-ellipsis overflow-hidden text-sm ">
                    <span>{els?.product?.title}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-white  rounded-xl p-4 flex-col flex gap-4">
              {/* <div className="flex justify-between text-gray-400">
              <span className="">Tạm tính</span>
              <div className="flex  text-black">
                224.100 <sub>₫</sub>
              </div>
            </div> */}

              <div className="flex justify-between text-gray-400">
                <span>Tổng tiền</span>
                <div className="flex flex-col ">
                  <div className="flex justify-end text-red-500  text-2xl">
                    {currentData?.cart.length > 0
                      ? formatMoney(
                          currentData?.cart?.reduce(
                            (sum, el) =>
                              sum + el?.quantity * Number(el?.product?.prices),
                            0
                          )
                        )
                      : 0}
                    <sub className="">đ</sub>
                  </div>
                  <span className="font-light text-xs">
                    (Đã bao gồm VAT nếu có)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                handleOnclick={() => {
                  navigate("/checkout/payment");
                  handleSetLocal();
                }}
                name={`Mua ngay (${getKeysFromLocalStorage().length}) `}
                fw
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Cart;
