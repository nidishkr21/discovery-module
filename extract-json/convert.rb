require 'smarter_csv'
require 'json'

options = {
  :remove_empty_values => false,
}

puts('Cleaning up existing files...')
FileUtils.mkdir_p('data')
FileUtils.rm_rf(Dir.glob('data/*'))
index = 0
puts('Reading file... Might take time')

records = SmarterCSV.process('./BlackFriday.csv', options)
records.each do |record|
    index += 1
    filename = (index).to_s.rjust(3, "0")
    puts('Running through row')
    puts(index)
    File.open("data/#{filename}.json", 'a') do |w|
    newRecord = record
    newRecord = {ID: index}.merge(record)
    newRecord[:user_id] = newRecord[:user_id].to_s
    newRecord[:occupation] = newRecord[:occupation].to_s
    newRecord[:stay_in_current_city_years] = newRecord[:stay_in_current_city_years].to_s;
    newRecord[:marital_status] = newRecord[:marital_status].to_s;
    newRecord[:product_category_1] = newRecord[:product_category_1].to_s;
    newRecord[:product_category_2] = newRecord[:product_category_2].to_s;
    newRecord[:product_category_3] = newRecord[:product_category_3].to_s;
    newRecord[:purchase] = newRecord[:purchase].to_s;
    w.puts JSON.pretty_generate(newRecord)
  end
end
