var head = 17;			// head size in cm

class BinauralNode{
    constructor(cntx){
    	this.cntx = cntx;
        this.input = this.cntx.createGain();
        this.output = this.cntx.createGain();
        this.output.gain.value = 0;
        this.gainRear = this.cntx.createGain()
        this.gainFront = this.cntx.createGain()
        this.merger = this.cntx.createChannelMerger();

        this.iidLeft = this.cntx.createBiquadFilter();
        this.iidRight = this.cntx.createBiquadFilter();
        this.ridRear = this.cntx.createBiquadFilter();
        this.iidLeft.type = "highshelf";
        this.iidRight.type = "highshelf";
        this.ridRear.type = "lowpass";
        this.iidLeft.frequency.value = this.fc;
        this.iidRight.frequency.value = this.fc;
        this.ridRear.frequency.value = this.fc; 
        this.ridRear.Q.value = 2;

        this.itdLeft = this.cntx.createDelay();
        this.itdRight = this.cntx.createDelay();
        //LEFT EAR
        this.input
            .connect(this.itdLeft)
            .connect(this.iidLeft)
            .connect(this.merger, 0, 0)
        //RIGHT EAR
        this.input
            .connect(this.itdRight)
            .connect(this.iidRight)
            .connect(this.merger, 0, 1)
        // REAR
        this.input
            .connect(this.ridRear)
            .connect(this.gainRear)
        this.gainRear.connect(this.output)

        this.merger
            .connect(this.gainFront)
            .connect(this.output)
    }
    //BINAURAL VARIABLES
    head = head/100;                //diameter in m
    h = this.head/2;            //radious in m
    c = 343;                    //sound velocity m/s
	fc = this.c / this.head;    //frequency cut
    //DISTANCE VARIABLES
    rollOff = 1;
    refDistance = 0;
    maxDistance = 200000;

    constant = 0.05;

    connect(destination){
        this.output.connect(destination);
    }

    disconnect(){
        this.input.disconnect()
        this.itdLeft.disconnect()
        this.iidLeft.disconnect()
        this.itdRight.disconnect()
        this.iidRight.disconnect()
        this.merger.disconnect()
        this.ridRear.disconnect()
        this.gainRear.disconnect()
        this.gainFront.disconnect()
        this.output.disconnect()
    }
    
    move(azimuth, distance){
        //azimuth 0 - 360 degrees
        //distance mm
        if (azimuth != NaN && azimuth >= 0 ){
            let g = this.linearDistance(distance);
            this.output.gain.setTargetAtTime(g, this.cntx.currentTime, this.constant);
            if(azimuth>180){ azimuth= -(180 - (azimuth - 180))}
            let frontDel = this.front(azimuth)
            this.itd(azimuth, frontDel)
            this.iid(azimuth)
        } else {
            return
        }
    }
    
    linearDistance(mm){
        //linear distance implementation
        return 1 - this.rollOff*((Math.max(Math.min(mm, this.maxDistance), this.refDistance) -this.refDistance) / (this.maxDistance - this.refDistance))   
    }

    itd(azimuth, frontDel){
        //azimuth 0/180(right) 0/-180(left)
        //frontDel = front delay in s
        let itdL, itdR;
        let theta = (azimuth/180)*Math.PI;
        if(theta > 0){
            theta = Math.abs(Math.PI/2 - Math.abs(Math.abs (theta) - Math.PI/2 ))
            itdL = 0
            itdR = (( this.h * theta + Math.sin(theta))/ this.c );
        } else {
            theta = Math.abs(Math.PI /2 - Math.abs( theta + Math.PI /2 ));
            itdL = (( this.h * theta + Math.sin(theta))/ this.c );
            itdR = 0
        }
        this.itdLeft.delayTime.setTargetAtTime(itdL + frontDel, this.cntx.currentTime, this.constant)
        this.itdRight.delayTime.setTargetAtTime(itdR + frontDel, this.cntx.currentTime, this.constant)
    }
    iid(azimuth){
        //azimuth 0/180(right) 0/-180(left)
        let iidL, iidR; 
        if(azimuth>90){azimuth = 180 - azimuth}
        else if (azimuth<-90){azimuth= -180 - azimuth}
        iidL = ((azimuth/90) * 9);
        iidR = ((azimuth/90) * -9);
        this.iidLeft.gain.setTargetAtTime(iidL, this.cntx.currentTime, this.constant) 
        this.iidRight.gain.setTargetAtTime(iidR, this.cntx.currentTime, this.constant)
    }
    front(azimuth){
        //azimuth 0/180(right) 0/-180(left)
        let az = Math.abs(azimuth)
        if (az > 90){
            let rear = (az-90)/90;
            let front = 1 - rear*0.8
            let theta = (az/180)*Math.PI - Math.PI/2;
            let frontDel = (( this.h * theta + Math.sin(theta))/ this.c )
            this.gainRear.gain.setTargetAtTime(rear*0.8, this.cntx.currentTime,this.constant)
            this.gainFront.gain.setTargetAtTime(front, this.cntx.currentTime,this.constant)
            return frontDel;
        } else {
            this.gainRear.gain.setTargetAtTime(0,this.cntx.currentTime,this.constant)
            this.gainFront.gain.setTargetAtTime(1,this.cntx.currentTime,this.constant)
            return 0;
        }
    }

}