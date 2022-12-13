import * as React from "react"

export const InnerWrapper = ({ comp, data }) => {
  return comp(data)
}

export default class OutterWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {    
    return { hasError: true, error };  
  }

  componentDidCatch(error, errorInfo) { 
    console.log("Component failed!")
  } 

  render() {
    if (this.state.hasError) {     
      return <div class="alert alert-danger flex-grow-0" role="alert">
        Runtime error while rendering component
        <pre class="mt-2">
          {this.state.error.toString()}
        </pre>
      </div>
    }

    return this.props.children; 
  }
}

export const withWrapper = (Comp, data) =>{
  return <OutterWrapper><InnerWrapper comp={Comp} data={data}/></OutterWrapper>
}