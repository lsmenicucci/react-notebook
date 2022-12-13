package server

import (
	"fmt"
	"net/http"
	"os"
	"path"

	"github.com/gin-gonic/gin"
  "github.com/gin-contrib/cors"
)


const compsDir = "./data/components"

func SaveComponent(compName, content string) (string, error) {
  if err := os.MkdirAll(compsDir, os.ModePerm) ; err != nil{
    return "", err
  }

  compSource := path.Join(compsDir, compName) + ".jsx"
  if err := os.WriteFile(compSource, []byte(content), os.ModePerm); err != nil{
    return "", err
  }

  return compSource, nil
}

func GetComponent(compName string, source bool) (string, error){
    fp := path.Join(compsDir, compName)

    if (source){
        fp = fp + ".jsx"
    }else{
        fp = fp + ".js"
    }

    _, err := os.Stat(fp)
    if (os.IsNotExist(err)){
        return "", err
    }

    fc, err := os.ReadFile(fp)
    return string(fc), err
}

type ComponentInput struct{
  Content string
  Compile bool  
}

func Run() {
  r := gin.Default()

  r.Use(cors.Default())

  r.StaticFS("component", http.Dir(compsDir))

  // r.GET("/component/:compName", func(c *gin.Context) {
  //   compName := c.Param("compName")

  //   compData, err := GetComponent(compName, false)
  //   if (err != nil){
  //       c.JSON(http.StatusBadRequest, gin.H{ "error": err.Error() })
  //       return
  //   }


  //   c.JSON(http.StatusOK, gin.H{ "data": compData })
  // })

  // r.GET("/component/:compName/source", func(c *gin.Context) {
  //   compName := c.Param("compName")

  //   compData, err := GetComponent(compName, true)
  //   if (err != nil){
  //       c.JSON(http.StatusBadRequest, gin.H{ "error": err.Error() })
  //       return
  //   }


  //   c.JSON(http.StatusOK, gin.H{ "data": compData })
  // })

  r.POST("/component/:compName", func(c *gin.Context) {
    compName := c.Param("compName")
    
    var json ComponentInput
    if err := c.ShouldBindJSON(&json); err != nil {
      c.JSON(http.StatusBadRequest, gin.H{ "error": err.Error() })
      return
    }

    compSource, err := SaveComponent(compName, json.Content)
    fmt.Println(err)
    if (err != nil){
      c.JSON(http.StatusBadRequest, gin.H{ "error": err.Error() })
      return
    }

    if (!json.Compile){
        c.JSON(http.StatusOK, gin.H{})
    }

    compRes, err := CompileJSX(compSource, "./.swcrc")
    if (err != nil){
        c.JSON(http.StatusBadRequest, gin.H{ "error": err.Error(), "compilation_result": compRes })
        return
    }

    c.JSON(http.StatusOK, gin.H{ "compilation_result": compRes })

  })

  r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}