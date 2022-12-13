import * as React from "react"
import classNames from "classnames"
import { useState, useEffect, useRef } from "react"

import { useParams } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import vm from "vm-browserify"

import DynamicWrapper, { Render } from "../Components/DynamicWrapper";

const DynamicComponent = ({ url, data }) => {
	const [Comp, setComp] = useState(null)

	useEffect(() => {
		fetch(url).then(async r => {
			const source = await r.text()
			const ctx = vm.createContext({ React, exports: {} })
			const sandbox = vm.createScript(source)

			sandbox.runInContext(ctx)

			setComp(ctx.exports)
		})


	}, [url])

	return url && Comp && Comp.default && <DynamicWrapper><Render comp={Comp.default} data={{ data }}/></DynamicWrapper>

}

const saveOptions = {
	method: 'POST',
	headers: {
		'Accept': 'application/json, text/plain, */*',
		'Content-Type': 'application/json'
	},
}

export default () => {
	const { compId } = useParams()

	const editorRef = useRef(null)
	const [sourceReq, setSourceReq] = useState({ loading: true, data: null, error: null })
	const [verticalLayout, setVerticalLayout] = useState(true)

	const compiledUrl = `http://localhost:8080/component/${compId}.js`
	const sourceUrl = `http://localhost:8080/component/${compId}.jsx`
	const saveUrl = `http://localhost:8080/component/${compId}`

	const [compUrl, setCompUrl] = useState(compiledUrl)

	useEffect(() => {
		(async () => {
			const req = await fetch(sourceUrl)
			if (req.status === 200) {
				setSourceReq({ loading: false, data: await req.text() })
			} else {
				setSourceReq({ loading: false, error: await req.text() })
			}
		})()
	}, [])

	const mountRef = (editor) => {
		console.log("Mounting editor", editor)
		editorRef.current = editor
	}

	const flushComponent = () => {
		setCompUrl(null)
		setTimeout(() => {
			setCompUrl(compiledUrl)
		}, 200)
	}

	const save = () => {
		if (editorRef.current == null) {
			console.log("No editor")
			return
		}

		const newSource = editorRef.current.getValue()
		const body = JSON.stringify({ content: newSource, compile: true })

		fetch(saveUrl, { ...saveOptions, body }).then(r => r.json()).then(r => {
			console.log("Component saved!")

			if (r.compilation_result && r.compilation_result.success === true){
				console.log("Reloading component")
				flushComponent()
			}
		})
	}

	const layoutClasses = verticalLayout ? "row h-50 w-100" : "col-6 h-100"

	return <div className="container-xl h-100 w-100 d-flex flex-column align-items-center p-2">
		<div className="row justify-content-end p-2">
			<button className="btn btn-primary" onClick={save} disabled={sourceReq.loading}>Save</button>
		</div>
		<div className="row d-flex flex-grow-1 w-100">
			<div className={classNames(layoutClasses, "d-block")}>
				{compUrl && <DynamicComponent url={compUrl} data={{ "x": 3 }} />}
			</div>
			<div className={classNames(layoutClasses, "d-flex py-2")}>
				{sourceReq.loading && <i>Loading source...</i>}
				{!sourceReq.loading && 
					<Editor
						defaultLanguage="javascript"
						onMount={mountRef}
						defaultValue={sourceReq.data} />
				}
				{!sourceReq.loading && sourceReq.error != null && <b>sourceReq.error</b>}
			</div>
		</div>
	</div>
}