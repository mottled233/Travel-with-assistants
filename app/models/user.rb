class User < ApplicationRecord
  # attributes
    has_secure_password
    def User.digest(string)
        cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                    BCrypt::Engine.cost
        BCrypt::Password.create(string, cost: cost)
    end
    
    def User.new_token
        SecureRandom.urlsafe_base64
    end
    
    # instance methods
    def remember
        self.remember_token = User.new_token
        update_attribute(:remember_digest, User.digest(remember_token))
    end
    
    def forget
        self.remember_token = nil
        update_attribute(:remember_digest, nil)
    end
    
    def remembered?(remember_token)
        return unless remember_digest
        BCrypt::Password.new(remember_digest).is_password?(remember_token)
    end
end
