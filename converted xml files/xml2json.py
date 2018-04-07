import os.path
from xmljson import parker as bf
from json import dumps
import xml.etree.ElementTree as ET
import re

for filename in os.listdir('data'):
    if filename.endswith(".xml"):
        #open xml file
        tree = ET.parse(os.path.join('data', filename))
        root = tree.getroot()
        #delete ".xml" from filename
        cleanFileName = re.sub('\.xml', '', filename)
        newFileName = cleanFileName + '.json'
        # import to new directory
        save_path = '/Users/danielhuang/Desktop/DanishFolkloreNexus/extras/data/jsonOutput'
        if not os.path.exists(save_path):
            os.makedirs(save_path)
        completeName = os.path.join(save_path, newFileName)
        #write json output to newFileName which should just be filename.json
        file = open(completeName, 'w')
        file.write(dumps(bf.data(root)))
        file.close()
        print(filename + ' completed')
        continue
    else:
        continue
