import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import React from 'react';

const theme = createTheme();

export const renderWithProviders = (ui: React.ReactElement) => {
	return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};
