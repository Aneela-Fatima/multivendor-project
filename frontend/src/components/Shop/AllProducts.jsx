import React,{useEffect} from 'react'
import {useSelector, useDispatch} from "react-redux"
import { getAllproductsShop } from "../../redux/actions/product"

const AllProducts = () => {
    const { products.isLoading} = useSelector((state)=>state.products);
    const {seller} = useSelector((state)=>state.seller)

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getAllProductsShop(seller._id))
    },[])
  return (
    <div>
      
    </div>
  )
}

export default AllProducts
