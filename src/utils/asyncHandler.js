const asyncHandler = (requestHandler) => { 
    return (req, res, next) => {
    Promise.resolve(requestHandler(res, req, next))
    .catch((err) => {
        console.log("ERROR FROM ASYNC HANDLER: " , err);
    })
}}



export { asyncHandler }


// const asyncHandler = (fnc) => { async (req, res, next) => {
//     try {
//         await fnc(req, res, next)
//     } catch (error) {
//         res.status(err.code || 404).json({
//             success: false,
//             message: err.message
//         })
//     }
// }}