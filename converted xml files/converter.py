import lxml.etree as ET

dom = ET.parse("example.xml")
xslt = ET.parse("example.xsl")
transform = ET.XSLT(xslt)
newdom = transform(dom)
#print(ET.tostring(newdom, pretty_print=True))

text_file = open("example.xml", "w")
text_file.write(ET.tostring(newdom, pretty_print=True))
text_file.close()
