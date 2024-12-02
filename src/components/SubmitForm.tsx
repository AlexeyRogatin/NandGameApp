"use client"

import React, { useState, useEffect } from 'react'

export type FormParam = {
    name: string,
    title: string,
    inputType: string,
    defValue: string,
}

export default function SubmitForm(
    {
        params,
        submit,
    } : {
        params: FormParam[],
        submit: (data: any) => {}
    }) {

    const [paramValues, setParamValues] = useState<string[]>(params.map((param) => param.defValue));

    const handleChange = (index: number) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {  
            const newParamData = Array.from(paramValues);
            newParamData[index] = e.target.value;
            setParamValues(newParamData);
        }
    }

    const handleSubmit = () => {
        const obj: any = {};
        for (const paramIndex in params) {
            obj[params[paramIndex].name] = paramValues[paramIndex];
        }
        submit(obj);
    }

    return (
        <div className="flex flex-col gap-6">
            {
                params.map((param, paramIndex) => (
                    <React.Fragment key={param.name}>
                        <h3>{param.title}</h3>
                        <input value={paramValues[paramIndex]} onChange={handleChange(paramIndex)} type={param.inputType}/>
                    </React.Fragment>
                ))
            }
            <button onClick={handleSubmit} className="border-4 rounded-xl p-2">Authorize</button>
        </div>
    )
}
