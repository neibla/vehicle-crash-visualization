import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import Crash from "./Crash";
import { includeCrash } from "./filters";
import Papa from "papaparse";

const initDataState = {
  loading: true,
};

interface IDataState {
  data?: Crash[];
  loading?: boolean;
  error?: Error;
}

function useRawCrashData(url: string): IDataState {
  const [state, setState] = useState<IDataState>(initDataState);

  useEffect(() => {
    Papa.parse(url, {
      download: true,
      dynamicTyping: true,
      header: true,
      skipEmptyLines: true,
      // worker: true,
      complete: function (results: any, file: any) {
        if (results.errors.length>0) {
          console.error(
            "Error occurred getting data from ",
            process.env.REACT_APP_DATA_URL,
            JSON.stringify(results.errors)
          );
          setState({ error: new Error("Unexpected Error loading data") });
          return;
        }
        setState({ data: results.data })
      }
    })

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

  return { ...state, data: filteredData };
}
