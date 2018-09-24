import os.path
import xml.etree.ElementTree as ET
import lxml.etree as ET
import re

for filename in os.listdir("."):
    if filename.endswith(".dfl"):
        #open xml file
        #tree = ET.parse(os.path.join('stories_xml', filename))
        #root = tree.getroot()

        #convert xml attributes to elements
        dom = ET.parse(filename)
        xslt = ET.parse("attributesToElements.xsl")
        transform = ET.XSLT(xslt)
        newdom = transform(dom)

        # import to new directory
        save_path = '/Users/timothyhuang/Projects/DFP/danishfolklore/converted xml files/informants'
        if not os.path.exists(save_path):
            os.makedirs(save_path)
        filename = os.path.join(save_path, filename)

        #write output to filename
        file = open(filename, 'w')
        file.write(ET.tostring(newdom, pretty_print=True))
        file.close()
        print(filename + ' completed')
        continue
    else:
        continue
