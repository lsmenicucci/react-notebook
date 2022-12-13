import React from "react"
import { useContext, useEffect } from 'react';
import { useRoutes } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components"

// import pages 
import CodeEditor from './Pages/CodeEditor';

const GlobalStyle = createGlobalStyle`
	body{
		margin: 0;
	}
`

const AppWrap = styled.div`
	box-sizing: border-box;
	display: flex;
	flex-flow: column;
	height: 100vh;
	overflow: hidden;
	padding: 1em 1em 0 1em;
	width: 100vw;
`

const ContentWrap = styled.div`
	display: flex;
	grow: 1;
	overflow: hidden;
`

export const baseRoutes = [
	{path: "/component/:compId", title: "Editor", element: <CodeEditor/>},
]


export const App = () => {
	return (
		<>
			<main className="page d-flex vh-100 overflow-hidden">
				<header className="navbar navbar-expand-md navbar-light d-print-none">
					<div className="container xl">
						editor
					</div>
				</header>
				<div className="page-wrapper overflow-hidden">
					{useRoutes(baseRoutes)}
				</div>
			</main>
		</>
		)
}
