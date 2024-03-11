import React, { useState } from 'react';
import './App.css';
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";

type TFomrData = {
    type: string
    shipping: boolean
    weight: number
}

type TFilamentType = {
  type: string,
  cost: number,
  weight: number,
  shipping: number
}

function App() {
  const [cost, setCost] = useState<number | undefined>(undefined)

  const typesOfFilament:TFilamentType[] = [
    {type: "PLA", cost: 175, weight: 2, shipping: 10},
    {type: "PET-G", cost: 175, weight: 2, shipping: 10},
    {type: "TPU", cost: 120, weight: 0.5, shipping: 10}
  ]

  const schema = yup.object().shape({
    type: yup.string().min(3).required("Choose type of Filament"),
    shipping: yup.boolean().required(),
    weight: yup.number().min(1).required("Define how heavy is your print")
  })

  const {register, handleSubmit, formState: {errors}} = useForm<TFomrData>({
    resolver: yupResolver(schema),
  })

  const calculate = (data: TFomrData) => {
    let chosenFilamnet:TFilamentType | undefined = typesOfFilament.find((element) => element.type === data.type)
    if(!chosenFilamnet) return
    let calculatedCost = chosenFilamnet.cost / (chosenFilamnet.weight * 1000) * data.weight
    
    calculatedCost = data.shipping ? calculatedCost += chosenFilamnet.shipping : calculatedCost

    setCost(Math.round(calculatedCost * 100) / 100)
  }
  return (
    <div className="App">
      <form onSubmit={handleSubmit(calculate)}>
        <h3>Calculate <span>Print</span> Cost</h3>
        <div className="field">
          <p>Filament type </p>
          <select id="filmentType" {...register("type")}>
            <option value={""}></option>
            {typesOfFilament.map((type) => <option value={type.type}>{type.type}</option>)}
          </select>
          {errors.type?.message && <p>{errors.type?.message}</p>}
        </div>
        <div className="field">
          <p>Weight of print</p>
          <input type="number" {...register("weight")} />
          {errors.weight?.message && <p>{errors.weight?.message}</p>}
        </div>
        <div className="field">
          <div className="row">
            <p>Shipping </p>
            <input type="checkbox" id="shipping" {...register("shipping")} />
          </div>
          <small>*Cost may be higher.</small>
        </div>
      <input type="submit" value="Calculate" />
      {cost && <p id='output'>{cost}zł</p>}
      </form>
    </div>
  );
}

export default App;
