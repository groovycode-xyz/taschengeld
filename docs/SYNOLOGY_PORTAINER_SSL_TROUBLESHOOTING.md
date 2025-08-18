# Synology NAS + Portainer SSL/HTTPS Redirect Troubleshooting Guide

## Problem Description

When running Taschengeld on a Synology NAS using Portainer, users may experience:

- Automatic redirect from HTTP to HTTPS
- SSL errors when trying to load the application
- Failed resource loading with SSL connection errors
- Application not loading properly due to mixed content issues

## Root Causes

The HTTPS redirect can be caused by several factors:

### 1. **Synology DSM Reverse Proxy**

Synology's DSM often has a built-in reverse proxy that automatically redirects HTTP to HTTPS.

### 2. **Portainer Settings**

Portainer might be configured to force HTTPS for all containers.

### 3. **Browser Security Settings**

Modern browsers may automatically upgrade HTTP to HTTPS if the domain was previously accessed via HTTPS.

### 4. **Docker Network Configuration**

The Docker network in Synology might have security policies forcing HTTPS.

## Troubleshooting Steps

### Step 1: Check Synology Reverse Proxy Settings

1. **Login to Synology DSM**
2. Go to **Control Panel** → **Application Portal** → **Reverse Proxy**
3. Check if there's a rule for port 3000 or your container
4. If found, either:
   - Delete the reverse proxy rule
   - OR configure it to use HTTP only (disable HTTPS redirect)

### Step 2: Check Synology Security Settings

1. In DSM, go to **Control Panel** → **Security**
2. Click on **Advanced** tab
3. Look for "Automatically redirect HTTP connection to HTTPS"
4. **Uncheck this option** if it's enabled
5. Apply the changes

### Step 3: Portainer Container Configuration

In Portainer, modify your Taschengeld container with these settings:

#### Environment Variables

Add these environment variables to force HTTP:

```
NODE_ENV=production
NEXTAUTH_URL=http://192.168.0.200:3000
NEXT_PUBLIC_BASE_URL=http://192.168.0.200:3000
NEXT_PUBLIC_VERCEL_URL=http://192.168.0.200:3000
```

#### Port Configuration

Ensure the port mapping is correct:

- Container Port: `3000`
- Host Port: `3000`
- Protocol: `TCP`
- NO SSL/TLS settings enabled

#### Labels (Remove if Present)

Remove any of these labels if they exist:

- `traefik.*` labels
- `nginx.*` labels
- Any SSL/HTTPS redirect labels

### Step 4: Clear Browser Cache and HSTS

The browser might have cached HTTPS Strict Transport Security (HSTS) settings:

#### Chrome/Edge:

1. Open Developer Tools (F12)
2. Go to Application → Clear Storage
3. Clear all site data
4. Try accessing `http://192.168.0.200:3000` in an Incognito/Private window

#### Alternative Method:

1. Navigate to `chrome://net-internals/#hsts` (Chrome) or `edge://net-internals/#hsts` (Edge)
2. Under "Delete domain security policies"
3. Enter `192.168.0.200` and click Delete
4. Clear browser cache completely

### Step 5: Check Docker Network Settings

In Portainer or SSH to Synology:

```bash
# Check if container is using bridge network
docker inspect [container_name] | grep NetworkMode

# List all networks
docker network ls

# Ensure using bridge or custom network without SSL enforcement
```

### Step 6: Direct Container Access Test

SSH into your Synology and test direct access:

```bash
# Get container ID
docker ps | grep taschengeld

# Test HTTP access from inside Synology
curl -I http://localhost:3000

# Check container logs for any redirect messages
docker logs [container_id] | grep -i "redirect\|https\|ssl"
```

## Solution Configurations

### Option A: Clean Portainer Setup (Recommended)

1. **Stop and remove existing container**
2. **Create new container with these exact settings:**

```yaml
Container Name: taschengeld
Image: groovycodexyz/taschengeld:latest
Network: bridge
Port Mapping: 3000:3000
Restart Policy: Unless stopped

Environment Variables:
- DATABASE_URL=postgresql://postgres:yourpassword@db:5432/tgeld?schema=public
- NODE_ENV=production
- NEXTAUTH_URL=http://192.168.0.200:3000

NO Labels
NO Advanced network settings
NO SSL/TLS configuration
```

### Option B: Using Docker Compose on Synology

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  app:
    image: groovycodexyz/taschengeld:latest
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://postgres:yourpassword@db:5432/tgeld?schema=public
      - NODE_ENV=production
      - NEXTAUTH_URL=http://192.168.0.200:3000
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=yourpassword
      - POSTGRES_DB=tgeld
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

Deploy with:

```bash
docker-compose up -d
```

### Option C: Disable All HTTPS Redirects

If the above doesn't work, create an override configuration:

1. **Create a custom network** without proxy:

```bash
docker network create --driver bridge taschengeld_net
```

2. **Run container with explicit HTTP only**:

```bash
docker run -d \
  --name taschengeld \
  --network taschengeld_net \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://postgres:password@db:5432/tgeld?schema=public" \
  -e NODE_ENV="production" \
  -e NEXTAUTH_URL="http://192.168.0.200:3000" \
  groovycodexyz/taschengeld:latest
```

## Advanced Debugging

### Check What's Causing the Redirect

1. **Use curl with verbose output**:

```bash
curl -v -L http://192.168.0.200:3000
```

Look for `Location:` headers showing HTTPS redirect

2. **Check browser network tab**:

- Open Developer Tools (F12)
- Go to Network tab
- Access http://192.168.0.200:3000
- Look for 301/302 redirects
- Check response headers for redirect source

3. **Check Synology Web Station**:

- Ensure Web Station isn't intercepting port 3000
- Disable Web Station if not needed

### Common Issues and Solutions

| Issue                      | Cause                     | Solution                                              |
| -------------------------- | ------------------------- | ----------------------------------------------------- |
| Immediate HTTPS redirect   | Synology DSM setting      | Disable automatic HTTPS redirect in Security settings |
| SSL certificate error      | Browser cached HSTS       | Clear HSTS settings for the IP address                |
| Port 3000 not accessible   | Firewall blocking         | Open port 3000 in Synology Firewall                   |
| Container keeps restarting | Database connection issue | Check DATABASE_URL and ensure DB container is running |
| Resources fail to load     | Mixed content blocking    | Ensure all environment URLs use HTTP not HTTPS        |

## If All Else Fails

### Nuclear Option - Complete Reset

1. **Remove all Taschengeld containers and volumes**
2. **Clear all browser data for the IP**
3. **Disable all Synology security features temporarily**
4. **Deploy fresh using basic Docker run**:

```bash
# Simple test deployment
docker run -d -p 3000:3000 groovycodexyz/taschengeld:latest
```

If this works, gradually add back your configuration.

### Alternative Access Methods

1. **Use IP:Port directly**: `http://192.168.0.200:3000`
2. **Use different port**: Map to 8080 instead of 3000
3. **Access from different device**: Test from phone/tablet
4. **Use container IP directly**: Find with `docker inspect`

## Contact Support

If none of these solutions work:

1. Collect container logs: `docker logs taschengeld > taschengeld.log`
2. Note your Synology DSM version
3. Note your Portainer version
4. Create issue at: https://github.com/groovycode-xyz/taschengeld/issues

Include:

- The troubleshooting steps you tried
- Screenshot of the error
- Container logs
- Your docker-compose.yml or Portainer configuration (remove passwords)

## Prevention Tips

1. **Always use HTTP URLs** in environment variables
2. **Avoid using Synology Reverse Proxy** for local applications
3. **Document your working configuration** once it works
4. **Use Docker Compose** for reproducible deployments
5. **Test in incognito mode** to avoid cache issues
