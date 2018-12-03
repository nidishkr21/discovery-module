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
    newRecord = record.map { |k, str| [k, record[k].to_s] }.to_h
    newRecord = {ID: index}.merge(newRecord)
    w.puts JSON.pretty_generate(newRecord)
  end
end
