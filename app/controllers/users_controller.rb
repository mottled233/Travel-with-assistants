class UsersController < ApplicationController
  def new
    @user = User.new
  end
  
  def show
    @user = User.find(params[:id])
  end
  
  def create
    @user = User.new(user_param)
    @user.user_role = USER_ROLE_STUDENT
    if @user.save
      flash[:success] = "欢迎, #{@user.username}!"
      log_in @user
      
      redirect_to user_url(@user)
    else
      render 'new'
    end
  end
  
  def edit
    @user = User.find(params[:id])
  end
  
  def update
    @user = User.find(params[:id])
    if @user.update_attributes(user_param)
      flash[:success] = "success to update user information!"
      redirect_to @user
    else
      render 'edit'
    end
  end
  
  private
  def user_param
    params.require(:user).permit(:username, :email, :password, :password_confirmation, :phone_number, :user_role, :nickname)
  end
end
