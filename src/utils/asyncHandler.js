const  asyncHandler= (requestHandler) =>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>next(err))
    }
}
export {asyncHandler}

// Asynchronous route handlers often involve promises or async/await syntax, which can result in unhandled promise rejections if errors are not properly caught. By using asyncHandler, you can simplify error handling for these asynchronous operations:
// •	Without asyncHandler:
// You need to manually use try...catch blocks to handle errors within each asynchronous route handler.