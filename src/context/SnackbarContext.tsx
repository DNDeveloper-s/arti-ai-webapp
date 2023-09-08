'use client';

import React, {createContext, FC, useState} from 'react';

interface ISnackbarData {
	status: 'warning' | 'error' | 'success',
	message: string;
}

type SnackbarData = ISnackbarData | null | false;

interface ISnackbarContext {
	snackBarData: [snackBarData: SnackbarData, setSnackBarData: React.Dispatch<React.SetStateAction<SnackbarData>>]
}

export const SnackbarContext = createContext<ISnackbarContext>({});

const SnackbarContextProvider: FC<{children: React.ReactElement}> = (props) => {
	const [snackBarData, setSnackBarData] = useState<SnackbarData>(null);

	return <SnackbarContext.Provider value={{
		snackBarData: [snackBarData, setSnackBarData]
	}}>
		{props.children}
	</SnackbarContext.Provider>
}

export default SnackbarContextProvider;
