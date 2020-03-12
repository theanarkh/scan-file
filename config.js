module.exports = {
    // scan the root, support string and array, you can use __dirname to control the root and output regardless of where the scan execute
    root: './test',
    // return true for exclude
	exclude: (absolutePathOfFile, filename) => {
        //return true
    },
    // the output file. can be null or function, if output is function,the result of hooks is as the params when execute the funcion
    output: 'output.txt',
    // hooks for handle the file content when scan file. you can do what you want here
    hooks: [
        function(file, filename) {
            return file.split(' ')[0];
        }
    ]
};