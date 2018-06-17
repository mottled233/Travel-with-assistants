class CreateInterestPoints < ActiveRecord::Migration[5.0]
  def change
    create_table :interest_points do |t|
      t.integer :user_id, index: true
      t.float :latitude
      t.float :longitude
      t.integer :zoom
      t.string :name
      t.timestamps
    end
  end
end
