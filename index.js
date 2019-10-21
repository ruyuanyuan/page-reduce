#!/usr/bin/env node

// node开发命令行工具头部必须加入 #!/usr/bin/env node

const program = require('commander')
const download = require('download-git-repo')
const handlebars = require('handlebars')
const inquirer = require('inquirer')
const fs =require('fs')
// const ora = require('ora')
const chalk = require('chalk')
const logSymbols=require('log-symbols')
const templates={
  'webpack-reduce':{
    url:'https://github.com/ruyuanyuan/webpack-reduce.git',
    downloadUrl:'https://github.com:ruyuanyuan/webpack-reduce#master',
    description:'webpack打包单页面'
  }
}
program
  .version('1.0.0')

program
  .command('init <templatenName> <projectName>')
  .description('初始化项目模板')
  .action((templatenName, projectName)=>{
    /**
     * download参数
     * 第一个参数：仓库地址
     * 第二个参数：下载路径
     */
   
    if(!templates[templatenName]){
      console.log(logSymbols.error,chalk.red('模板不存在'))
      return
    }
    // let spinner = ora('正在下载...').start()
    console.log(logSymbols.info,chalk.blue('下载中。。。'))
    const {downloadUrl}=templates[templatenName]
    download(downloadUrl,projectName,{clone:true},(err)=>{
      //下载失败
      if(err){
        // spinner.fail() //下载失败
        console.log(logSymbols.error,chalk.red('下载失败'))
        console.log(logSymbols.error,chalk.red(err))
        return
      }
      console.log(logSymbols.success,chalk.green('下载成功'))
      // spinner.stop()
      //项目下package.json文件读取出来
      //使用向导方式采集用户输入数据
      //解析数据，替换模板，重新写入
      inquirer.prompt([
        {
          type:'input',
          name:'name',
          message:'请输入项目名称'
        },
        {
          type:'input',
          name:'description',
          message:'请输入项目描述'
        },
        {
          type:'input',
          name:'author',
          message:'请输入项目负责人'
        }
      ])
      .then(answers => {
        const packagePath=`${projectName}/package.json`
        const  packageContent= fs.readFileSync(packagePath,'utf8')
        const packageResult=handlebars.compile(packageContent)(answers)
        fs.writeFileSync(packagePath,packageResult)
        console.log(logSymbols.success,chalk.yellow('初始化模板成功'))
      });
    })
  });

  program
  .command('list')
  .description('查看所有可用模板')
  .action(()=>{
    for(let key in templates){
      console.log(`名称：${key}    功能：${templates[key].description}`)
    }
  });

program.parse(process.argv);