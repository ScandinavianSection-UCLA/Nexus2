import subprocess
import os
import sys

'''
give path to shapefiles as system argument
-love ben
'''

def main(directory):
    file_list=os.listdir(directory)
    print(file_list)

    def _mkdir():
        ogr_dump=directory+'/temp'
        if os.path.isdir(ogr_dump):
            pass
        else:
            os.mkdir(ogr_dump)
        return ogr_dump
    dump_dir= _mkdir()

    for item in file_list:
        if item.endswith(".shp"):
            shape_path=directory+'/'+item #os.path.abspath(item)
            out_path=dump_dir +'/'+ item.replace('.shp','.geojson')
            ogr_call=['ogr2ogr'
                    ,'-f'
                    ,'GeoJSON'
                    ,'{}'.format(out_path)
                    ,'{}'.format(shape_path)
                    ,'-a_srs',"EPSG:3857"
                    ]
            #print(ogr_call)
            subprocess.call(ogr_call,shell=False)






if __name__=='__main__':
    foo=sys.argv[1] 
    main(foo)
