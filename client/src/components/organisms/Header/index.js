import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/logo.png";
import icons from "../../../utils/icons";
import { Link } from "react-router-dom";
import path from "../../../utils/path";
import { Button, Input } from "../../atoms";
import { apiGetProduct } from "../../../services/productService";
const { IoIosSearch } = icons;
const Header = () => {
  const [hidden, setHidden] = useState(false);
  const [value, setValue] = useState("");
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getData = setTimeout(async () => {
      const response = await apiGetProduct({ title: value });
      if (response?.success) setProduct(response?.products);
    }, 500);
    return () => clearTimeout(getData);
  }, [value]);
  const searchHanle = async (e) => {
    const valueInput = e.target.value;
    if (valueInput.length > 0) {
      setHidden(false);
      const response = await apiGetProduct({ title: valueInput });
      setValue(e.target.value);
      if (response?.success) setProduct(response?.products);
    } else {
      setHidden(true);
    }
  };
  const handleOnClick = (e) => {
    if (e.type === "click") {
      //   setHidden(!hidden);
      setValue("");
      console.log(value);
    }
  };
  return (
    <div className="flex w-full relative ">
      <div className="flex flex-6 ">
        <Link to={`/${path.HOME}`}>
          <img
            src={logo}
            alt="logo"
            className="w-[72px] h-[72px] ml-[30px] mr-[50px] my-[10px] object-cover"
          />
        </Link>
        <div className="flex  pitems-center w-[749px] h-[40px] my-[10px] border border-gray-200 rounded-lg placeholder:text-gray-500 justify-between">
          <div className="flex py-2 gap-2 ">
            <IoIosSearch size={24} className="text-gray-500 ml-[18px]" />
            <input
              onChange={(e) => setValue(e.target.value)}
              type="text"
              className="w-[600px] h-[21px] outline-none border-none px-4 placeholder:border-none placeholder:outline-none"
              placeholder="Bạn tìm gì hôm nay"
            />
            {/* <Input
              style={"w-[618px] h-[21px] outline-none"}
              nameKey={"Bạn tìm gì hôm nay"}
            /> */}
            {/* <input
              type="text"
              placeholder="Bạn tìm gì hôm nay"
              className="w-[618px] h-[21px] outline-none "
            /> */}
          </div>
          <div className="flex items-center justify-center ml-[-16px] ">
            <span className="w-[1px] h-[24px]  bg-gray-200 "></span>
            <Button
              style={
                "text-sm text-blue-600 w-[90px] h-[38px] hover:bg-blue-400 hover:rounded-r-md"
              }
              name="Tìm kiếm"
            />
            {/* <button className="text-sm text-blue-600 w-[90px] h-[38px] hover:bg-blue-400 hover:rounded-r-md">
              Tìm kiếm
            </button> */}
          </div>
        </div>
      </div>
      <div
        className={`absolute ${
          hidden ? "hidden" : ""
        }   top-[50px] right-0 bottom-0 h-fit z-50 w-[82%] bg-white left-[16%] border-gray-200 rounded-lg overflow-y-auto scrollbar-hide`}
        onClick={() => handleOnClick}
      >
        {product?.map((el) => (
          <Link to={`/${el?.type}/${el?._id}/${el?.slug}`} key={el?._id}>
            <div className=" p-4 flex gap-6">
              <div className="flex text-gray-400 items-center justify-center gap-2">
                <div>
                  <IoIosSearch />
                </div>
                <img
                  className="w-[40px] h-[40px]"
                  src={el.thumb?.[0]?.split(",")[0].split(" ")[0]}
                  alt=""
                />
              </div>
              <span className="font-normal text-sm">{el?.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Header;
