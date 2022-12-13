package server

import (
	"os"
	"os/exec"
	"strings"
)

type CompilationResult struct{
	Success 	bool 	`json:"success"`
	Output 		string 	`json:"output"`
	OutputFile 	string 	`json:"output_file"`
}

func CompileJSX(path, configFilepath string) (*CompilationResult, error){
	_, err := os.Stat(configFilepath)
	if (os.IsNotExist(err)){
		return nil, err
	}

	res := &CompilationResult{}
	outPath := strings.TrimSuffix(path, ".jsx") + ".js"

	args := []string{
		"--config-file", configFilepath, 
		"-o", outPath,
		path,
	}

	cmd := exec.Command("swc", args...)
	output, err := cmd.CombinedOutput()

	if (err == nil){
		res.Success = true
		res.OutputFile = outPath
	}else{
		res.Success = false
	}

	res.Output = string(output)

	return res, nil
}
