import sqlite3
import ast

connection = sqlite3.connect('participants.db')
cursor = connection.cursor()
cursor.execute("SELECT * FROM turkdemo") #turkdemo
results = cursor.fetchall()
map_str = lambda x: ','.join(map(str, x))

null=None
true=True
false=False

header= ['Subject','trial_type','simple_response','complex_response']
output = [map_str(header)]

incr = 0
t_num = 0
#r as whole procedure
for r in results:
    pp=0
    #print("r",accou,":","\n\n")
    #try:
    dic= eval(r[len(r)-1].encode('ascii', 'ignore'))
    #print("dic:","\n\n")
    if 'data' in dic:
        trial = dic['data']
        #print("trial:",trial,"\n\n\n\n\n")

        for t in trial:
            #print("t:","\n\n")
            header = [x for x in t]
            tt = t['trialdata']
            #print("tt:",tt,"\n\n")

            print("incr:",incr)

            trail_type = 'complex_simple'
            #if pp==1:
            if trail_type=='simple_complex':
                if 'response1' in tt:
                    response1 = tt['response1']
                    print(response1)
                    flag = 1
                if 'response2' in tt and flag == 1:
                    print("response2:", tt['response2'])
                    out = [int(incr)+1, trail_type, response1, abs(int(tt['response2'])-5)]
                    print("out:", out)
                    output.append(map_str(out))
                    flag = 0

            else:
                if 'response2' in tt:
                    response2 = tt['response2']
                    print(response2)
                    flag = 1
                if 'response1' in tt and flag == 1:
                    print("response1:", tt['response1'])
                    out = [int(incr)+1, trail_type, abs(int(tt['response1'])-5), response2]
                    print("out:", out)
                    output.append(map_str(out))
                    flag = 0

            if tt['phase'] == 'postquestionnaire' and tt['status'] == 'submit':
                incr += 1



    #except:
     #   print("FAIL")


#for o in output:
  #  print o
with open('data.csv','w') as f:
    f.write('\n'.join(output))
    f.close()
    
#with open('results/data.csv','w') as f:
 #   f.write('\n'.join(output))
  #  f.close()
    

