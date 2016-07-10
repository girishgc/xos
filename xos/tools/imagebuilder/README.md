sudo mkdir /image
cd /tmp/
wget http://www.vicci.org/cord/ceilometer-trusty-server-multi-nic.compressed.qcow2
sudo cp ceilometer-trusty-server-multi-nic.compressed.qcow2 /image/trusty-server-multi-nic.img
sudo apt-add-repository ppa:ansible/ansible
sudo apt-get update
sudo apt-get install ansible qemu-utils
sudo modprobe nbd
cd ~/xos/xos/tools/imagebuilder/
sudo make vsg_image

