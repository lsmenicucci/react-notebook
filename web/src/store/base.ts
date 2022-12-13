import * as immutable from "object-path-immutable"

export interface BaseState{
	setProp: (path: string, value: any) => void
	mergeProp: (path: string, value: any) => void
	assignProp: (path: string, value: any) => void
}

type dotPropMethod = (state: any, path: string, value: any) => any

const wrapDotProp = (set, method: dotPropMethod) => (path: string, value: any) => 
	set(state => {
		return method(state, path, value)
	})


export const initBaseState = (set) => <BaseState>({
	setProp: wrapDotProp(set, immutable.set),
	mergeProp: wrapDotProp(set, immutable.merge),
	assignProp: wrapDotProp(set, immutable.assign),
})