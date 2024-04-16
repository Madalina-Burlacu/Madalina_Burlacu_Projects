const Comments = require("./commentsModel");
const Shifts = require("../Shifts/shiftsModel");
const User = require("../Users/userModel");

// localhost:2000/api/comment/createComment
exports.createComment = async (request, response) => {
    try {
        const shift = await Shifts.findById(request.body.shiftId);
        const userId = request.userIdFromToken;
        const userBring = await User.findById(userId);

        if (Object.keys(request.body).length === 0) {
            return response.status(400).json({
                status: "failed",
                message:
                    "Request body is empty. Please provide the necessary data.",
            });
        }

        if (!request.body.shiftId) {
            return response.status(403).json({
                status: "failed",
                message: "Please provide the shiftId.",
            });
        }

        if(!shift){
            return response.status(403).json({
                status: 'failed',
                message: 'Shift not found!'
            })
        }

        if (userId == shift.userId || userBring.role === "admin") {

            const newCommentData = {
                ...request.body,
                userId: shift.userId
            }
            const newComment = await Comments.create(newCommentData);

            await Shifts.findByIdAndUpdate(request.body.shiftId, {
                $push: { comments: newComment._id },
            });

            response.status(201).json({
                status: "success",
                data: newComment,
            });
        } else {
            return response.status(403).json({
                status: "failed",
                message:'You are not allowed to get this information'
            });
        }
    } catch (err) {
        response.status(400).json({
            status: "failed",
            message: err.message,
        });
    }
};

//localhost:2000/api/comment/:id
exports.updateCommentById = async (request, response) => {
    try {
        if (Object.keys(request.body).length === 0) {
            return response.status(400).json({
                status: "failed",
                message:
                    "Request body is empty. Please provide the necessary data.",
            });
        }

        if (!request.body.description) {
            return response.status(400).json({
                status: "failed",
                message: "Request body must receive the description",
            });
        }

        if (Object.keys(request.body).length > 1) {
            return response.status(400).json({
                status: "failed",
                message: "Request body must receive just the description",
            });
        }

        const idCommentToFind = request.params.id;
        const userId = request.userIdFromToken;
        const userBring = await User.findById(userId);

        let commentToUpdate = await Comments.findById(idCommentToFind);

        if (userId == commentToUpdate.userId || userBring.role === "admin") {
            let updatedComment = await Comments.findByIdAndUpdate(
                idCommentToFind,
                { ...request.body, updated: Date.now() },
                { new: true, runValidators: true }
            );
            response.status(200).json({
                status: "failed",
                data: updatedComment,
            });
        } else {
            return response.status(403).json({
                status: "failed",
                message:'You are not allowed to get this information'
            });
        }
    } catch (err) {
        response.status(400).json({
            status: "failed",
            message: err.message,
        });
    }
};

//localhost:2000/api/comment/getCommentById/:id
exports.getCommentById = async (request, response) =>{
    try{
        let comment = await Comments.findById(request.params.id);

        const userId = request.userIdFromToken;
        const userBring = await User.findById(userId);

        if(!comment){
            return response.status(403).json({
                status: 'failed',
                message:"No comment found!"
            })
        }

        if(userId == comment.userId || userBring.role === "admin"){
            response.status(200).json({
                status: 'success',
                data: comment
            })
        }else{
            return response.status(403).json({
                status: 'failed',
                message:'You are not allowed to get this information'
            })
        }
    }catch(err){
        response.status(400).json({
            status:'failed',
            message: err.message
        })
    }
}

//localhost:2000/api/comment/commentsUserLogged
exports.getAllCommentsOfUserLogged = async(request, response) =>{
    try{
        const currentUserLoggedId = request.user.id;
        const allCommentsUserLogged = await Comments.find({
            userId: currentUserLoggedId
        });

        response.status(200).json({
            status:'success',
            data: allCommentsUserLogged,
        })
    }catch(err){
        response.status(404).json({
            status:'failed',
            message: err.message
        })
    }
}

//localhost:2000/api/comment/allComments
exports.getAllCommentsForAdmin = async(request, response) =>{
    try{
        const allComments = await Comments.find();

        response.status(200).json({
            status:'success',
            length: allComments.length,
            data: allComments
        })
    }catch(err){
        response.status(404).json({
            status:'failed',
            message: err.message
        })
    }
}

//localhost:2000/api/comment/deleteComment/:id
exports.deteleCommentByAdmin = async(request, response) =>{
    try{
        const comment = await Comments.findByIdAndDelete(request.params.id);

        response.status(200).json({
            status: 'success',
            message: `Comment with id ${comment._id} was deleted.`
        })
    }catch(err){
        response.status(404).json({
            status:'failed',
            message: err.message
        })
    }

}