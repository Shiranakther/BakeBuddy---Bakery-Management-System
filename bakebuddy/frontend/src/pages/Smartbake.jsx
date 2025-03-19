import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const Smartbake = () => {
  let { id } = useParams();

  const newid = id;


  return (
    <div>
      <p>{newid}</p>
    </div>
  );
};

export default Smartbake;
