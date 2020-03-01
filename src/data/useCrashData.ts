import { useState, useEffect,useMemo } from "react";
import PropTypes from "prop-types";
import { csv } from "d3-request";
import Crash from "./Crash";
import { includeCrash } from "./filters";

const initDataState = {
  loading: true,
};

interface IDataState {
  data?: Crash[];
  loading?: boolean;
  error?: Error;
}

function caster(row: any) {
  const result = { ...row };
  for (const key of Object.keys(row)) {
    const castedNumber = Number(row[key]);
    if (!Number.isNaN(castedNumber)) {
      result[key] = castedNumber;
    }
  }
  return result;
}

function useRawCrashData(url:string): IDataState {
  const [state, setState] = useState<IDataState>(initDataState);

  useEffect(() => {
    csv(url, caster, (error, data) => {
      if (error) {
        console.error(
          "Error occurred getting data from ",
          process.env.REACT_APP_DATA_URL,
          error
        );
        setState({ error });
        return;
      }
      const result = data as unknown as Crash[];
      setState({ data: result });
    });
  }, [url]);

  return state;
}


useRawCrashData.propTypes = {
  url: PropTypes.string.isRequired,
};


export default function useCrashData(filters: object): IDataState {
  const state = useRawCrashData(process.env.REACT_APP_DATA_URL || "REACT_APP_DATA_URL not set")
  const { data } = state;
  const filteredData = useMemo(
    () => data?.filter(crash => includeCrash(crash, filters)),
    [filters, data]
  );

  return {...state, data: filteredData};
}
